package LearnPath.Backend.payload;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserProfileRequest {
    private String year;
    private String branch;
    private String goal;
}
